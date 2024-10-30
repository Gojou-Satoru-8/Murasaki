import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";

const ChangeInfoModalButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      {/* <Button onPress={onOpen}>Run Code</Button> */}
      <Button color="danger" variant="flat" onPress={onOpen}>
        Update Password
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        // onClose={cleanupOnCloseModal}
        size="2xl"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Update Your Info</ModalHeader>
              <ModalBody>
                <Input
                  name="email"
                  // value={userInput}
                  label="User Input"
                  radius="none"
                  variant="faded"
                  // onChange={handleUserInputChange}
                ></Input>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={closeModal}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeInfoModalButton;
