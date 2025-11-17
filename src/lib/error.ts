export class ResourceExistsError extends Error {
    constructor(message= "Resource already exists"){
        super(message);
        this.name = "ResourceExistsError";
    }
    
}

export class CreateResourceError extends Error {
constructor(message = "An error occurred while creating resource"){
    super(message);
    this.name = "CreateResourceError";
}
}

export class ResourceNotFoundError extends Error {
constructor(message = "This ressource doesn't exist"){
    super(message);
    this.name = "ResourceNotFoundError";
}
}

export class InvalidCredentialsError extends Error {
    constructor(message = "Invalid credentials") {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}

export class InvalidTokenError extends Error {
    constructor(message = "Invalid or expired token") {
        super(message);
        this.name = "InvalidTokenError";
    }
}

export class InvalidExchangeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidExchangeError";
    }
}
