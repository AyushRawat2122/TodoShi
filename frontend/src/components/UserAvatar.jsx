import React, { memo } from 'react';

const UserAvatar = memo(({ user }) => {
  const hasAvatar = user?.avatar?.url || user?.image?.url;

  if (hasAvatar) {
    return (
      <img
        src={user.avatar?.url || user.image?.url}
        alt={user.name || user.username}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-[#c2a7fb] bg-opacity-30 flex items-center justify-center">
      <span className="text-sm font-medium text-[#4c1f8e] dark:text-purple-300">
        {(user.name || user.username || "?").charAt(0).toUpperCase()}
      </span>
    </div>
  );
});

export default UserAvatar;
