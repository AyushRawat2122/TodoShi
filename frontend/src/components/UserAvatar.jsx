import React, { memo } from 'react';

const UserAvatar = memo(({ user, className = "" }) => {
  const hasAvatar = user?.avatar?.url || user?.image?.url;
  const userId = user?._id;

  const avatarContent = hasAvatar ? (
    <img
      src={user.avatar?.url || user.image?.url}
      alt={user.name || user.username}
      className={`rounded-full object-cover ${className === "" ? "w-10 h-10" : className}`}
    />
  ) : (
    <div className={`w-10 h-10 rounded-full bg-[#c2a7fb] bg-opacity-30 flex items-center justify-center ${className}`}>
      <span className="text-sm font-medium text-[#4c1f8e] dark:text-purple-300">
        {(user.name || user.username || "?").charAt(0).toUpperCase()}
      </span>
    </div>
  );

  if (!userId) {
    return avatarContent;
  }

  return (
    <a
      href={`/user/${userId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer"
      title={`View ${user.name || user.username}'s profile`}
    >
      {avatarContent}
    </a>
  );
});

export default UserAvatar;
