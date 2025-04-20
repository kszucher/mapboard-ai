import { Request, Response, Router } from 'express';
import { mapService } from '../map-service/map.controller';
import { shareService } from '../share-service/share.controller';
import { checkJwt, prismaClient } from '../startup';
import { userService } from '../user-service/user.controller';
import { SignInService } from './sign-in.service';

const router = Router();
const signInService = new SignInService(prismaClient, mapService, userService, shareService);

router.post('/sign-in', checkJwt, async (req: Request, res: Response) => {
  const signInResponseDto = await signInService.signIn({ userSub: req.auth?.payload.sub ?? '' });
  res.json(signInResponseDto);
});

export default router;
