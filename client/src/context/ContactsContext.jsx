import { createContext, useState, useCallback, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from './AuthContext';

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idToken } = useAuth();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Get all user contacts
  const fetchContacts = useCallback(async () => {
    const response = await fetch("http://localhost:5300/contacts", {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    if (!response.ok) {
      console.error('Error:', response);
      return;
    }

    const fetchedContacts = await response.json();
    setContacts(fetchedContacts);
    console.log('Request successful');
    return fetchedContacts;
  }, [idToken]);

  // Get a contact
  const fetchAContact = async (id) => {
     const response = await fetch(`http://localhost:5300/contacts/${id}`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
     });

     if (!response.ok) {
      throw new Error("Failed to get contact");
     }

     const fetchedContact = await response.json();
     console.log('Fetched contact successfully');
     return fetchedContact;
  };

  // Create contact
  const addContact = async (newContact) => {
    const response = await fetch('http://localhost:5300/contacts', {
      method: "POST",
      body: newContact,
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to create contact');
    }

    const newContactJson = await response.json();
    setContacts((prevContacts) => [...prevContacts, newContactJson]);
    console.log('Contact created successfully');
  };

  // Update contact
  const updateContact = async (contacts_id, updatedContact) => {
    console.log(updatedContact);
    const response = await fetch(`http://localhost:5300/contacts/${contacts_id}`, {
      method: "PUT",
      body: updatedContact,
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      },
    });
    console.log(updatedContact);

    if (!response.ok) {
      throw new Error("Failed to update contact");
    };

    const updatedContactJson = await response.json();

    if (response.ok) {
      console.log(updatedContact);
      setContacts((prevContacts) => {
        return prevContacts.map((contact) =>
          contact.contacts_id === contacts_id ? updatedContactJson : contact
        );
      });
      console.log("Contact updated successfully");
      // return setLoading(false);
      // Confirm to user that update was successful. Exit.
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    const response = await fetch(`http://localhost:5300/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete contact');
    }
    if (response.ok) {
        setContacts((prevContacts) => {
            return prevContacts.filter((contact) => contact.contacts_id !== id);
        });
        console.log("Contact deleted successfully");
    }
  };

  // Email indiviual contact
  const emailContact = async (contacts_id, subject, message) => {
    const response = await fetch(`http://localhost:5300/app/contacts/${contacts_id}/email`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({ subject, message }),
    });

    if (!response.ok) {
      throw new Error('Failed to email contact');
    }

    console.log("Email sent successfully");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ContactsContext.Provider
      value={{ contacts, fetchContacts, fetchAContact, addContact, updateContact, deleteContact, emailContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
};