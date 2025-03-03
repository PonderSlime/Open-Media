import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPalette, faPager, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
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
                                
                                    <FontAwesomeIcon icon={faPalette} className={`h-6 w-6 ${styles.icon}`} />
                                    <span className={styles.text}>Artists</span>
                                
                            </a>
                        </li>
                        <li>
                            <a href="/genres">
                                
                                    <FontAwesomeIcon icon={faPager} className={`h-6 w-6 ${styles.icon}`} />
                                    <span className={styles.text}>Genres</span>
                                
                            </a>
                        </li>
                        <li>
                            <a href="/playlists">
                                
                                    <FontAwesomeIcon icon={faCompactDisc} className={`h-6 w-6 ${styles.icon}`} />
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