import express               from 'express';
import TransactionController from '../controllers/TransactionController.js';

const router = express.Router();
const transactionController = new TransactionController();

router.route('/').get(transactionController.get);
router.route('/').post(transactionController.create);
router.route('/:id').put(transactionController.update);
router.route('/:id').delete(transactionController.delete);

export default router;
