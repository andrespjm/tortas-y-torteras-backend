import { Purchases } from '../models/Purchases.js';
import { col, fn, literal, Op } from 'sequelize';
import { OrderItems } from '../models/OrderItems.js';
import { Stocks } from '../models/Stocks.js';
import { Products } from '../models/Products.js';
import { Users } from '../models/Users.js';

const getSales = async data => {
	const { total } = data;
	if (total === 'all') {
		const sales = await Purchases.findAll({
			where: {
				[Op.not]: [{ status: 'Cart' }],
			},
			include: [
				{
					model: OrderItems,
					include: [
						{
							model: Stocks,
							include: [
								{
									model: Products,
								},
							],
						},
					],
				},
				{
					model: Users,
				},
			],
		});
		const totalSalesPromise = sales.map(el => ({
			orderId: el.id,
			client: el.UserId,
			status: el.status,
			name: el.User.displayName,
			email: el.User.email,
			date: el.createdAt,
			month: el.createdAt.getMonth(),
			shipmentFee: el.shipmentFee,
			tax: el.tax,
			products: el.OrderItems.reduce(
				(prev, el) => prev + el.price * el.quantity,
				0
			),
			total:
				el.shipmentFee +
				el.tax +
				el.OrderItems.reduce((prev, el) => prev + el.price * el.quantity, 0),
		}));

		const totalSales = Promise.all(totalSalesPromise);

		return totalSales;
	}
	if (total === 'byUser') {
		const sales = await Purchases.findAll({
			where: {
				[Op.not]: [{ status: 'Cart' }],
			},
			attributes: [
				'UserId',
				[fn('sum', col('shipmentFee')), 'shipmentFee'],
				[fn('sum', col('tax')), 'tax'],
			],
			include: [
				{
					model: OrderItems,
					attributes: [[literal('SUM(price * quantity)'), 'price']],
				},
			],
			group: ['Purchases.UserId'],
			raw: true,
		});

		const totalSalesPromise = sales.map(el => ({
			userId: el.UserId,
			shipmentFee: el.shipmentFee,
			tax: el.tax,
			products: el['OrderItems.price'],
			total: el.shipmentFee + el.tax + el['OrderItems.price'],
		}));

		const totalSales = await Promise.all(totalSalesPromise);

		return totalSales;
	}
	if (total === 'byProductType') {
		const sales = await Purchases.findAll({
			where: {
				[Op.not]: [{ status: 'Cart' }],
			},
			attributes: [
				[fn('sum', col('shipmentFee')), 'shipmentFee'],
				[fn('sum', col('tax')), 'tax'],
			],
			include: [
				{
					model: OrderItems,
					attributes: [[literal('SUM(price * quantity)'), 'productprice']],
					raw: true,
					include: [
						{
							model: Stocks,
							attributes: ['ProductTypeName'],
						},
					],
				},
			],
			group: ['OrderItems.Stock.ProductTypeName'],
			raw: true,
		});

		const totalSalesPromise = sales.map(el => ({
			productType: el['OrderItems.Stock.ProductTypeName'],
			shipmentFee: el.shipmentFee,
			tax: el.tax,
			products: el['OrderItems.productprice'],
			total: el.shipmentFee + el.tax + el['OrderItems.productprice'],
		}));

		const totalSales = await Promise.all(totalSalesPromise);

		return totalSales;
	}

	const sales = await Purchases.findAll({
		where: {
			[Op.not]: [{ status: 'Cart' }],
		},
		include: [
			{
				model: OrderItems,
				include: [
					{
						model: Stocks,
						include: [
							{
								model: Products,
							},
						],
					},
				],
			},
			{
				model: Users,
			},
		],
	});
	return sales;
};

export { getSales };
