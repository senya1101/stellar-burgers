import styles from './title-wrapper.module.css';
import { ReactElement } from 'react';

export const TitleWrapper = ({
  title,
  children
}: {
  title: string;
  children: ReactElement;
}) => (
  <div className={styles.wrapper}>
    <h3 className={`text text_type_digits-default ${styles.title}`}>{title}</h3>
    {children}
  </div>
);
