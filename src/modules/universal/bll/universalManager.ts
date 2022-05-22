import {BadRequestException, ValidationPipe} from "@nestjs/common"


export const handleValidationPipe = () => {
    return new ValidationPipe({
            exceptionFactory: (errors) => new BadRequestException(errors),
            validationError: {target: false}, transform: true
        }
    )
}
