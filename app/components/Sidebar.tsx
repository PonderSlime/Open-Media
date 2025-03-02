import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMusic, faList } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    return (
        <>
            <aside className={styles.sidebar}>
                <nav>
                    <ul>
                        <li>
                            <a href="/">
                                    <div>
                                        <FontAwesomeIcon icon={faHome} className={`h-6 w-6 ${styles.icon}`}/>
                                    </div>       
                                    <span className={styles.text}>Home</span>
                                
                            </a>
                        </li>
                        <li>
                            <a href="/artists">
                                
                                    <FontAwesomeIcon icon={faMusic} className={`h-6 w-6 ${styles.icon}`} />
                                    <span className={styles.text}>Artists</span>
                                
                            </a>
                        </li>
                        <li>
                            <a href="/playlists">
                                
                                    <FontAwesomeIcon icon={faList} className={`h-6 w-6 ${styles.icon}`} />
                                    <span className={styles.text}>Playlists</span>
                                
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
            <div className={styles.overlay}></div>
        </>
    );
};

export default Sidebar;