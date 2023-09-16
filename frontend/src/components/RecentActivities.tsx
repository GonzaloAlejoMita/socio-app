import RecentActivity from "./RecentActivity";
import { RecentActivityType } from "../Types/RecentActivity.type";

type Props = {
  isMyProfile: boolean;
  username: string;
  userFirstName: string;
  recentActivities: RecentActivityType[];
};

const RecentActivities: React.FC<Props> = ({
  isMyProfile,
  username,
  userFirstName,
  recentActivities,
}) => {
  return (
    <div className="flex flex-col gap-4 text-gray-600">
      {recentActivities.length ? (
        recentActivities.map((recentActivity) => (
          <RecentActivity
            key={recentActivity._id}
            isMyProfile={isMyProfile}
            username={username}
            userFirstName={userFirstName}
            recentActivity={recentActivity}
          />
        ))
      ) : (
        <p>
          {isMyProfile ? "You don't" : `${userFirstName} doesn't`} have any
          recent activities.
        </p>
      )}
    </div>
  );
};

export default RecentActivities;
