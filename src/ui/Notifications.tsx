interface NotificationsProps {
  notifications: string[];
}

export function Notifications({ notifications }: NotificationsProps) {
  return (
    <div className="panel">
      <h2>Notifications</h2>
      <div className="notifications">
        {notifications.slice(-6).map((message, index) => (
          <div key={`${message}-${index}`}>
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
