import express                   from 'express';
import TransactionTypeController from '../controllers/TransactionTypeController.js';

const router = express.Router();
const transactionTypeController = new TransactionTypeController();

router.route('/').get(transactionTypeController.get);
router.route('/').post(transactionTypeController.create);
router.route('/:id').put(transactionTypeController.update);
router.route('/:id').delete(transactionTypeController.delete);

export default router;
