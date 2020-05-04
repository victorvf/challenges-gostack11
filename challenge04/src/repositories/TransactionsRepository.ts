/* eslint-disable no-param-reassign */
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Array<Transaction>;

  constructor() {
    this.transactions = [];
  }

  public all(): Array<Transaction> {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (result: Omit<Balance, 'total'>, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            result.income += transaction.value;
            break;
          case 'outcome':
            result.outcome += transaction.value;
            break;
          default:
            break;
        }

        return result;
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
