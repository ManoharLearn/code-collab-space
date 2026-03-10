import { useRoom } from "@/context/RoomContext";
import LoginScreen from "@/components/LoginScreen";
import RoomDirectory from "@/components/RoomDirectory";
import RoomView from "@/components/RoomView";

export default function Index() {
  const { currentUser, currentRoom } = useRoom();

  if (!currentUser) return <LoginScreen />;
  if (currentRoom) return <RoomView />;
  return <RoomDirectory />;
}
