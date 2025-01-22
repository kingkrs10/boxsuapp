const MessageForwarding = ({ message, contacts, onForward }) => {
    const [selectedContacts, setSelectedContacts] = useState([]);
    
    return (
      <div className="p-4">
        <h3 className="font-medium mb-4">Forward to...</h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
              onClick={() => {
                setSelectedContacts(prev =>
                  prev.includes(contact.id)
                    ? prev.filter(id => id !== contact.id)
                    : [...prev, contact.id]
                );
              }}
            >
              <Checkbox
                checked={selectedContacts.includes(contact.id)}
                className="h-4 w-4"
              />
              <Avatar className="h-8 w-8">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name[0]}</AvatarFallback>
              </Avatar>
              <span className="flex-1">{contact.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => onForward(selectedContacts)}
            disabled={selectedContacts.length === 0}
          >
            Forward
          </Button>
        </div>
      </div>
    );
  };