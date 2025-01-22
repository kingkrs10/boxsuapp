const UserProfile = ({ user, isContact, onAddContact, onBlock }) => {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 text-center border-b">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-500">{user?.status}</p>
        </div>
  
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Phone</span>
              <span>{user?.phone}</span>
            </div>
          </div>
  
          <div className="pt-4 space-y-2">
            {!isContact && (
              <Button 
                variant="default" 
                className="w-full"
                onClick={onAddContact}
              >
                Add to Contacts
              </Button>
            )}
            <Button 
              variant="ghost" 
              className="w-full text-red-600"
              onClick={onBlock}
            >
              Block User
            </Button>
          </div>
        </div>
      </div>
    );
  };