import express, { Request, Response } from 'express';
import { getTrendingProducts, getCategorySales, getTotalSales, getProducts, getSales, getProductById, getAllSales } from '../controllers/analyticsController';

const router = express.Router();

router.get('/total_sales', async (req: Request, res: Response) => {
  try {
    const totalSales = await getTotalSales(req, res);  
    res.json(totalSales);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching total sales', error: err });
  }
});

router.get('/trending_products', async (req: Request, res: Response) => {
  try {
    await getTrendingProducts(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trending products', error: err });
  }
});



router.get('/category_sales', async (req: Request, res: Response) => {
  try {
     await getCategorySales(req, res); 
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category sales', error: err });
  }
});


router.get('/products', async (req: Request, res: Response) => {
  try {
     await getProducts(req, res); 
    
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
});

router.get('/allsales', async (req: Request, res: Response) => {
  try {
     await getAllSales(req, res); 
    
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
});

router.get('/sales', async (req: Request, res: Response) => {
  try {
     await getSales(req, res);
    
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sales', error: err });
  }
});

router.get('/products/:id', async (req: Request, res: Response) => {
  try {
     await getProductById(req, res); 
    
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ProductById', error: err });
  }
});

export default router;
