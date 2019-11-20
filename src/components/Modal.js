import React from "react";
import {
  Button,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/core";

export const Modal = ({
  children,
  onSubmit,
  onClose,
  title = "Modal Title",
  isOpen
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button onClick={onSubmit} variantColor="blue">
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
