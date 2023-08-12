import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GroupsContext } from '../../context/GroupsContext';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { PiPlusThin } from 'react-icons/pi';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import './ViewGroups.css';

export default function Groups() {
  const { groups, fetchGroups } = useContext(GroupsContext);
  const { idToken, authLoading } = useAuth();

  useEffect(() => {
    if (auth.currentUser && idToken && !authLoading) {
      fetchGroups();
    } else if (!authLoading) {
      console.log("User not signed in");
    }
  }, [fetchGroups, idToken, authLoading]);

  if (authLoading) {
    // please replace this later
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="view-groups-container">
        <Header className="view-groups-header" />
        <div className="groups-container">
          <h1 className="groups-h1">Groups</h1>
          <div className="display-groups-container">
            {groups && groups.map((group) => (
              <Card key={group.group_id} className="group-card" style={{ backgroundImage: `url(${group.cover_picture})`}}>
                <Link className="group-details-link" to={'/app/groups/' + group.group_id}>
                  <h2>
                    {group.group_name}
                  </h2>
                  <p>
                    {group.about_text}
                  </p>
                </Link>
              </Card>
            ))}
            <div className="add-group-icon-container">
              <Link className="add-group-link" to={'/app/groups/create-group'}>
                <PiPlusThin className='add-group-icon' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
