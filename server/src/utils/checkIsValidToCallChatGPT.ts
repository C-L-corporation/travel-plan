import { UserWithParsedId } from '../authenticate';
import { User } from '../models';
import { IPlan } from '../models/plan';

export const checkIsValidToCallChatGPT = async (
  user: UserWithParsedId
): Promise<boolean> => {
  if (user.admin) return true;

  try {
    const populatedUser = await User.findById(user.id).populate({
      path: 'plans',
      options: { sort: { createdAt: -1 }, limit: 3 },
    });
    if (!populatedUser) return false;
    if (populatedUser.plans.length < 3) return true;

    // check if the last 3 plans are the in 24 hours
    const [latestPlan, secondLatestPlan, thirdLatestPlan] =
      populatedUser.plans as unknown as [IPlan, IPlan, IPlan];
    const latestPlanDate = new Date(latestPlan.createdAt);
    const secondLatestPlanDate = new Date(secondLatestPlan.createdAt);
    const thirdLatestPlanDate = new Date(thirdLatestPlan.createdAt);
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const latestPlanAge = now.getTime() - latestPlanDate.getTime();
    const secondLatestPlanAge = now.getTime() - secondLatestPlanDate.getTime();
    const thirdLatestPlanAge = now.getTime() - thirdLatestPlanDate.getTime();
    if (
      latestPlanAge < oneDay &&
      secondLatestPlanAge < oneDay &&
      thirdLatestPlanAge < oneDay
    )
      return false;

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
