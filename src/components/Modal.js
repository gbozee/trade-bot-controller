import React from "react";
import {
  Button,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal
} from "@chakra-ui/core";

export const XModal = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitButtonProps = {},
  cancelButtonProps = {},
  ButtonTitle="Save",
  ...rest
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...rest}>
      <ModalOverlay />
      <ModalContent maxHeight="100vh" overflowY="scroll">
        <ModalCloseButton />
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            {...cancelButtonProps}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button color="blue" {...submitButtonProps} onClick={onSubmit}>
            {ButtonTitle}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
