import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch(NotFoundException, ApolloError, Error) // Catch multiple types of exceptions
export class AllExceptionFilter implements ExceptionFilter, GqlExceptionFilter {

    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: Error, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        let message = 'Internal server error';
        let statusCode = 500;

        if (exception instanceof NotFoundException) {
            message = exception.message;
            statusCode = exception.getStatus();
            this.logger.error(`NotFoundException: ${message}`);
        } else if (exception instanceof ApolloError) {
            message = exception.message;
            statusCode = exception.extensions.code;
            this.logger.error(`ApolloError: ${message}`);
        } else if (exception instanceof Error) {
            message = exception.message;
            this.logger.error(`Error: ${message}`);
        }

        this.logger.log(exception.stack);

        gqlHost.getContext().res.status(statusCode).json({
            statusCode,
            message,
        });
    }
}
