class TransactionTypeController {
    constructor() {
        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    get(request, response) {
        response.send('Get transaction type');
    }

    create(request, response) {
        response.send('Create transaction type');
    }

    update(request, response) {
        response.send('Update transaction type');
    }

    delete(request, response) {
        response.send('Delete transaction type');
    }
}

export default TransactionTypeController;
