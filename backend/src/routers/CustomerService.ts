import { Request, Response, Router } from 'express';
import { CustomerService, ICustomerServiceRep } from '../models';

export const customerServiceRouter = Router();

export const getAvailableCustomerServiceRepresentatives = async (
  _req: Request,
  res: Response
) => {
  try {
    const reps = await CustomerService.find<ICustomerServiceRep>({
      available: true,
    });
    res.json(reps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const toggleAvailabilityCustomerServiceRepresentative = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const rep = await CustomerService.findById<ICustomerServiceRep>(id);
    if (!rep) {
      return res.status(404).send('Customer Service Representative not found');
    }
    rep.available = !rep.available;
    await rep.save();
    res.json(rep);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

customerServiceRouter.get('/', getAvailableCustomerServiceRepresentatives);
customerServiceRouter.patch(
  '/:id/toggle-availability',
  toggleAvailabilityCustomerServiceRepresentative
);
