/**@jsx jsx */
/* eslint-disable react-hooks/rules-of-hooks */
import {jsx, Modal, ThemeProvider, getThemeByName} from '@tishman/components';
import {useMemo} from 'react';
import {ModalCard} from './ModalCard';
import {ModalErrorCard} from './ModalErrorCard';

import type {BuyTicketsData} from '~components/BuyTickets/types';

interface BuyTicketsModalProps {
  toggle: boolean;
  closeModal: () => void;
  error?: Error;
  data?: BuyTicketsData;
}

const getModal = (
  closeModal: () => void,
  modalData: BuyTicketsData | Record<string, unknown>,
  modalData2: BuyTicketsData | Record<string, unknown>,
  modalData3: BuyTicketsData | Record<string, unknown>,
  error?: Error,
): JSX.Element | null => {
  switch (error?.message) {
    case 'CARD':
      return <ModalCard closeModal={closeModal} {...modalData} />;
    case 'UPSELL':
      return <ModalCard closeModal={closeModal} {...modalData2} />;
    case 'ANYTIME':
      return <ModalCard closeModal={closeModal} {...modalData3} icon />;
    default:
      return (
        <ModalErrorCard
          title={error ? error.name : ''}
          description={error ? error.message : ''}
          closeModal={closeModal}
        />
      );
  }
};

export const BuyTicketsModal = ({
  toggle,
  closeModal,
  error,
  data,
}: BuyTicketsModalProps): JSX.Element => {
  let modalData = {};
  let modalData2 = {};
  let modalData3 = {};

  if (data) {
    const card1 = data.page.modalCard;
    const card2 = data.page.modalCard2 ? data.page.modalCard2 : null;
    const card3 = data.page.modalCard3 ? data.page.modalCard3 : null;

    if (card1) {
      modalData = useMemo(() => {
        return {
          title: card1.title,
          subTitle: card1.subTitle,
          description: card1.description,
          cta: card1.cta,
          link: card1.link,
          fluid: card1?.image?.src?.childImageSharp.fluid,
          alt: card1?.image?.alt,
        };
      }, [card1]);
    }

    if (card2) {
      modalData2 = useMemo(() => {
        return {
          title: card2.title,
          subTitle: card2.subTitle,
          description: card2.description,
          cta: card2.cta,
          link: card2.link,
          fluid: card2?.image?.src?.childImageSharp.fluid,
          alt: card2?.image?.alt,
        };
      }, [card2]);
    }

    if (card3) {
      modalData3 = useMemo(() => {
        return {
          title: card3.title,
          description: card3.description,
          cta: card3.cta,
        };
      }, [card3]);
    }
  }

  return (
    <ThemeProvider theme={getThemeByName('Rock Center')}>
      <Modal isOpen={toggle} onClose={closeModal}>
        {getModal(closeModal, modalData, modalData2, modalData3, error)}
      </Modal>
    </ThemeProvider>
  );
};
