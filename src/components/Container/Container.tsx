import classNames from 'classnames';
import styles from './Container.module.scss';
import { IContainer } from './Container.props';

export const Container = ({ children, className }: IContainer): JSX.Element => {
  return (
    <div className={classNames(styles.container, className)}>{children}</div>
  );
};
