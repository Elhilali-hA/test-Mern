import { Request, Response } from 'express';
import Sale from '../models/Sale';
import Product from '../models/Product';


export const getTotalSales = async (req: Request, res: Response) => {
  try {
    const totalSales = await Sale.aggregate([
      {
        $match: {
          TotalAmount: { $exists: true, $ne: null }, 
        },
      },
      {
        $project: {
          TotalAmount: { $toDouble: '$TotalAmount' }, 
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$TotalAmount' },
        },
      },
    ]);
    
    if (totalSales.length === 0) {
      return { totalSales: 0 };
    }


    return { totalSales: totalSales[0].totalAmount };
  } catch (error) {
    console.error('Error in getTotalSales:', error);
    throw error;
  }
};


export const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    
    const result = await Sale.aggregate([
      {
        $lookup: {
          from: 'products',  
          let: { productId: { $toString: '$ProductID' } },  
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$ProductID' }, '$$productId']  
                }
              }
            }
          ],
          as: 'productDetails'  
        }
      },
      {
        $project: {
          ProductID: 1,
          Quantity: { $toDouble: '$Quantity' },  
          TotalAmount: { $toDouble: '$TotalAmount' },  
          productName: { $arrayElemAt: ['$productDetails.ProductName', 0] } 
        }
      },
      {
        $group: {
          _id: '$ProductID', 
          productName: { $first: '$productName' },  
          totalQuantitySold: { $sum: '$Quantity' },  
          totalSalesAmount: { $sum: '$TotalAmount' } 
        }
      },
      { $sort: { totalQuantitySold: -1 } },  
      { $limit: 3 }  
    ]);
    
    
    if (result.length === 0) {
      return res.json({ result: [] });
    }
    
    return res.json({ result });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


export const getCategorySales = async (req: Request, res: Response) => {
  try {
    const result = await Sale.aggregate([
      {
        $lookup: {
          from: 'products',  
          let: { productId: { $toString: '$ProductID' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$ProductID' }, '$$productId']  
                }
              }
            },
            { $project: { Category: 1 } }  
          ],
          as: 'productDetails' 
        }
      },
      {
        $addFields: {
          category: {
            $cond: {
              if: { $eq: [{ $size: '$productDetails' }, 0] },  
              then: 'Unknown',  
              else: { $arrayElemAt: ['$productDetails.Category', 0] }  
            }
          }
        }
      },
      {
        $group: {
          _id: '$category',  
          totalSales: { $sum: { $toDouble: '$TotalAmount' } }, 
          totalQuantity: { $sum: { $toDouble: '$Quantity' } } 
        }
      },
      {
        $project: {
          category: '$_id', 
          totalSales: 1,
          totalQuantity: 1,
          _id: 0  
        }
      }
    ]);

    const totalSalesAllCategories = result.reduce((acc: number, category: any) => acc + category.totalSales, 0);

    const salesWithPercentage = result.map((category) => ({
      ...category,
      salesPercentage: ((category.totalSales / totalSalesAllCategories) * 100).toFixed(2)
    }));

    return res.json(salesWithPercentage);  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};




export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await Product.find({}, { ProductID: 1, ProductName: 1, Category: 1, Price: 1 });

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllSales = async (req: Request, res: Response) => {
  try {
    const result = await Sale.find({}, { SaleID: 1, ProductID: 1, Quantity: 1, Date: 1, TotalAmount: 1 });

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 30; 
    const skip = (page - 1) * limit; 

    const result = await Sale.find({}, { SaleID: 1, ProductID: 1, Quantity: 1, Date: 1, TotalAmount: 1 })
      .skip(skip) 
      .limit(limit);  

    const totalSales = await Sale.countDocuments();

    return res.json({
      totalSales,
      totalPages: Math.ceil(totalSales / limit), 
      currentPage: page,
      data: result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;  

    const product = await Product.findOne({ ProductID: productId }, { ProductID: 1, ProductName: 1, Category: 1, Price: 1 });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};