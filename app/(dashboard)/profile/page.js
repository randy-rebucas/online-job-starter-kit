import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import ProfileView from "./ProfileView";

export default async function ProfilePage() {
  const session = await auth();
  await dbConnect();
  const user = await User.findById(session.user.id)
    .select("name email mobileNumber facebookProfile currentStatus")
    .lean();

  return (
    <ProfileView
      name={user?.name || ""}
      email={user?.email || ""}
      mobileNumber={user?.mobileNumber || ""}
      facebookProfile={user?.facebookProfile || ""}
      currentStatus={user?.currentStatus || ""}
    />
  );
}
