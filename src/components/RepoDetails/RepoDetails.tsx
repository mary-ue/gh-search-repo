import { Chip } from '@mui/material';
import styles from './RepoDetails.module.scss';
import { IRepoDetails } from './RepoDetails.props';
import StarRateIcon from '@mui/icons-material/StarRate';

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
                  style={{ backgroundColor: '#d1d0d0', color: '#000000' }}
                />
              </li>
            ))
          ) : (
            <li>
              <p>Не указан</p>
            </li>
          )}
        </ul>
        <div className={styles.raiting}>
          <StarRateIcon sx={{ color: '#FFB400' }} />
          <p className={styles.count}>{stargazers.totalCount}</p>
        </div>
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {licenseInfo && <p className={styles.licence}>{licenseInfo.name}</p>}
    </div>
  );
};
