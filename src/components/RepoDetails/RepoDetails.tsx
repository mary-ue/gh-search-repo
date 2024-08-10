import { Chip } from '@mui/material';
import styles from './RepoDetails.module.scss';
import { IRepoDetails } from './RepoDetails.props';

export const RepoDetails = ({ repo }: IRepoDetails): JSX.Element => {
  if (!repo) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.choose}>Выберите репозиторий</p>
      </div>
    );
  }

  const {
    primaryLanguage,
    languages,
    stargazers,
    description,
    licenseInfo,
    name,
  } = repo;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{name}</h2>
      <div className={styles.info}>
        <div className={styles.mainLanguage}>
        <Chip
          label={primaryLanguage?.name || 'Не указан'}
          color="primary"
          style={{ backgroundColor: '#2196F3', color: '#FFFFFF' }}
        />
        </div>
        <ul className={styles.allLanguages}>
        {languages && languages.nodes.length > 0 ? (
            languages.nodes.map((lang) => (
              <li key={lang.name} className={styles.languageItem}>
                <Chip
                  label={lang.name}
                  style={{ backgroundColor: '#d1d0d0', color: '#000000' }} // серый фон, черный текст
                />
              </li>
            ))
          ) : (
            <li><p>Не указан</p></li>
          )}
        </ul>
        <div className={styles.raiting}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#FFB400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 17.77L18.18 21.5L16.54 14.47L22 9.74L14.81 9.13L12 2.5L9.19 9.13L2 9.74L7.46 14.47L5.82 21.5L12 17.77Z" />
          </svg>
          <p className={styles.count}>{stargazers.totalCount}</p>
        </div>
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {licenseInfo && <p className={styles.licence}>{licenseInfo.name}</p>}
    </div>
  );
};
