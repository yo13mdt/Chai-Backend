class ApiResoponse {
    constructor(status, data, message = "Success") {
        this.statusCode = status;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400

    }
}

export {ApiResoponse};