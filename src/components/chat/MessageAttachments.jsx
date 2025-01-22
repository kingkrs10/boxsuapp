const MessageAttachments = ({ attachments, onUpload }) => {
    return (
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onUpload}>
            <Paperclip className="h-4 w-4 mr-2" />
            Add Files
          </Button>
          <Button variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </Button>
        </div>
        
        {attachments?.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {attachments.map((attachment, index) => (
              <div 
                key={index} 
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                {attachment.type.startsWith('image') ? (
                  <img 
                    src={URL.createObjectURL(attachment)} 
                    alt="attachment"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white"
                  onClick={() => onRemoveAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };