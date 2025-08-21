import { FC, memo } from 'react';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => (
    <>
      <div className={styles.modal} data-cy={'modal'}>
        <div className={styles.header}>
          <h3
            className={`${styles.title} text ${title.includes('#') ? 'text_type_digits-default' : 'text_type_main-large'}`}
          >
            {title}
          </h3>
          <button
            data-cy={'modal-close'}
            className={styles.button}
            type='button'
          >
            <CloseIcon type='primary' onClick={onClose} />
          </button>
        </div>
        <div data-cy={'modal'} className={styles.content}>
          {children}
        </div>
      </div>
      <ModalOverlayUI onClick={onClose} />
    </>
  )
);
