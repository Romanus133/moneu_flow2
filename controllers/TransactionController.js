class TransactionController {
    constructor() {
        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    get(request, response) {
        response.send('Get transaction');
    }

    create(request, response) {
        response.send('Create transaction');
    }

    update(request, response) {
        response.send('Update transaction');
    }

    delete(request, response) {
        response.send('Delete transaction');
    }
}

export default TransactionController;
