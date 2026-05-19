import React, { createContext, useContext, useState, useEffect } from "react";
import { isFirebaseConfigured, db, auth } from "../firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { defaultData } from "../data/defaultData";
import { adminCredentials } from "../data/adminConfig";

const SiteDataContext = createContext();

export const useSiteData = () => useContext(SiteDataContext);

export const SiteDataProvider = ({ children }) => {
  // Global States
  const [hero, setHero] = useState(defaultData.hero);
  const [about, setAbout] = useState(defaultData.about);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contactInfo, setContactInfo] = useState(defaultData.contactInfo);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(defaultData.settings);
  const [authorizedEmails, setAuthorizedEmails] = useState(adminCredentials.authorizedGoogleEmails);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Storage mode status
  const [firebaseActive, setFirebaseActive] = useState(isFirebaseConfigured);

  // Initialize and load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (isFirebaseConfigured) {
        try {
          // --- 1. LOAD HERO DATA ---
          const heroDocRef = doc(db, "siteData", "hero");
          const heroSnap = await getDoc(heroDocRef);
          if (heroSnap.exists()) {
            setHero(heroSnap.data());
          } else {
            // Seed default
            await setDoc(heroDocRef, defaultData.hero);
            setHero(defaultData.hero);
          }

          // --- 2. LOAD ABOUT DATA ---
          const aboutDocRef = doc(db, "siteData", "about");
          const aboutSnap = await getDoc(aboutDocRef);
          if (aboutSnap.exists()) {
            setAbout(aboutSnap.data());
          } else {
            await setDoc(aboutDocRef, defaultData.about);
            setAbout(defaultData.about);
          }

          // --- 3. LOAD CONTACT DATA ---
          const contactDocRef = doc(db, "siteData", "contactInfo");
          const contactSnap = await getDoc(contactDocRef);
          if (contactSnap.exists()) {
            setContactInfo(contactSnap.data());
          } else {
            await setDoc(contactDocRef, defaultData.contactInfo);
            setContactInfo(defaultData.contactInfo);
          }

          // --- 4. LOAD SETTINGS DATA ---
          const settingsDocRef = doc(db, "siteData", "settings");
          const settingsSnap = await getDoc(settingsDocRef);
          if (settingsSnap.exists()) {
            setSettings(settingsSnap.data());
          } else {
            await setDoc(settingsDocRef, defaultData.settings);
            setSettings(defaultData.settings);
          }

          // --- LOAD AUTHORIZED GOOGLE ADMIN EMAILS ---
          const adminsDocRef = doc(db, "siteData", "admins");
          const adminsSnap = await getDoc(adminsDocRef);
          if (adminsSnap.exists()) {
            setAuthorizedEmails(adminsSnap.data().emails || adminCredentials.authorizedGoogleEmails);
          } else {
            await setDoc(adminsDocRef, { emails: adminCredentials.authorizedGoogleEmails });
            setAuthorizedEmails(adminCredentials.authorizedGoogleEmails);
          }

          // --- 5. LOAD PORTFOLIO ITEMS ---
          const portfolioCol = collection(db, "portfolio");
          const portfolioSnap = await getDocs(portfolioCol);
          if (!portfolioSnap.empty) {
            const list = portfolioSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by order index if available
            list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            setPortfolio(list);
          } else {
            // Seed portfolio items in batch
            const batch = writeBatch(db);
            defaultData.portfolio.forEach((proj, idx) => {
              const docRef = doc(portfolioCol, proj.id);
              batch.set(docRef, { ...proj, orderIndex: idx });
            });
            await batch.commit();
            setPortfolio(defaultData.portfolio.map((p, idx) => ({ ...p, orderIndex: idx })));
          }

          // --- 6. LOAD SERVICES ---
          const servicesCol = collection(db, "services");
          const servicesSnap = await getDocs(servicesCol);
          if (!servicesSnap.empty) {
            const list = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            setServices(list);
          } else {
            const batch = writeBatch(db);
            defaultData.services.forEach((serv, idx) => {
              const docRef = doc(servicesCol, serv.id);
              batch.set(docRef, { ...serv, orderIndex: idx });
            });
            await batch.commit();
            setServices(defaultData.services.map((s, idx) => ({ ...s, orderIndex: idx })));
          }

          // --- 7. LOAD TESTIMONIALS ---
          const testimonialsCol = collection(db, "testimonials");
          const testimonialsSnap = await getDocs(testimonialsCol);
          if (!testimonialsSnap.empty) {
            const list = testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            setTestimonials(list);
          } else {
            const batch = writeBatch(db);
            defaultData.testimonials.forEach((test, idx) => {
              const docRef = doc(testimonialsCol, test.id);
              batch.set(docRef, { ...test, orderIndex: idx });
            });
            await batch.commit();
            setTestimonials(defaultData.testimonials.map((t, idx) => ({ ...t, orderIndex: idx })));
          }

          // --- 8. LOAD INBOX MESSAGES ---
          const messagesCol = collection(db, "messages");
          const messagesSnap = await getDocs(messagesCol);
          const msgList = messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          msgList.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
          setMessages(msgList);

          // Setup Auth listener
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
          });
          return unsubscribe;

        } catch (error) {
          console.error("Error connecting with Firestore, reverting to local backup mode:", error);
          setFirebaseActive(false);
          loadLocalData();
        }
      } else {
        loadLocalData();
      }
    };

    const loadLocalData = () => {
      // Local Storage Mode
      const storedHero = localStorage.getItem("shan_hero");
      setHero(storedHero ? JSON.parse(storedHero) : defaultData.hero);

      const storedAbout = localStorage.getItem("shan_about");
      setAbout(storedAbout ? JSON.parse(storedAbout) : defaultData.about);

      const storedPortfolio = localStorage.getItem("shan_portfolio");
      setPortfolio(storedPortfolio ? JSON.parse(storedPortfolio) : defaultData.portfolio);

      const storedServices = localStorage.getItem("shan_services");
      setServices(storedServices ? JSON.parse(storedServices) : defaultData.services);

      const storedTestimonials = localStorage.getItem("shan_testimonials");
      setTestimonials(storedTestimonials ? JSON.parse(storedTestimonials) : defaultData.testimonials);

      const storedContact = localStorage.getItem("shan_contact");
      setContactInfo(storedContact ? JSON.parse(storedContact) : defaultData.contactInfo);

      const storedMessages = localStorage.getItem("shan_messages");
      setMessages(storedMessages ? JSON.parse(storedMessages) : []);

      const storedSettings = localStorage.getItem("shan_settings");
      setSettings(storedSettings ? JSON.parse(storedSettings) : defaultData.settings);

      const storedAdmins = localStorage.getItem("shan_authorized_emails");
      setAuthorizedEmails(storedAdmins ? JSON.parse(storedAdmins) : adminCredentials.authorizedGoogleEmails);

      // Simple localStorage Admin Session check
      const adminSession = localStorage.getItem("shan_admin_session");
      if (adminSession === "true") {
        setCurrentUser({ email: "admin@portfolio.local", uid: "admin_local", isLocal: true });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // --- SAVE METHODS ---

  // Hero Manager
  const saveHeroData = async (newHero) => {
    setHero(newHero);
    if (firebaseActive) {
      await setDoc(doc(db, "siteData", "hero"), newHero);
    } else {
      localStorage.setItem("shan_hero", JSON.stringify(newHero));
    }
  };

  // About Manager
  const saveAboutData = async (newAbout) => {
    setAbout(newAbout);
    if (firebaseActive) {
      await setDoc(doc(db, "siteData", "about"), newAbout);
    } else {
      localStorage.setItem("shan_about", JSON.stringify(newAbout));
    }
  };

  // Portfolio items
  const addProject = async (proj) => {
    const id = "proj_" + Date.now();
    const newProj = { id, ...proj, orderIndex: portfolio.length };
    const updated = [...portfolio, newProj];
    setPortfolio(updated);

    if (firebaseActive) {
      await setDoc(doc(db, "portfolio", id), newProj);
    } else {
      localStorage.setItem("shan_portfolio", JSON.stringify(updated));
    }
  };

  const editProject = async (id, updatedProj) => {
    const updated = portfolio.map(p => p.id === id ? { ...p, ...updatedProj } : p);
    setPortfolio(updated);

    if (firebaseActive) {
      await setDoc(doc(db, "portfolio", id), updated.find(p => p.id === id));
    } else {
      localStorage.setItem("shan_portfolio", JSON.stringify(updated));
    }
  };

  const deleteProject = async (id) => {
    const updated = portfolio.filter(p => p.id !== id);
    setPortfolio(updated);

    if (firebaseActive) {
      await deleteDoc(doc(db, "portfolio", id));
    } else {
      localStorage.setItem("shan_portfolio", JSON.stringify(updated));
    }
  };

  const reorderProjects = async (reorderedList) => {
    // Add indices
    const normalized = reorderedList.map((p, idx) => ({ ...p, orderIndex: idx }));
    setPortfolio(normalized);

    if (firebaseActive) {
      const batch = writeBatch(db);
      normalized.forEach(p => {
        batch.update(doc(db, "portfolio", p.id), { orderIndex: p.orderIndex });
      });
      await batch.commit();
    } else {
      localStorage.setItem("shan_portfolio", JSON.stringify(normalized));
    }
  };

  // Services
  const addService = async (serv) => {
    const id = "serv_" + Date.now();
    const newServ = { id, ...serv, orderIndex: services.length };
    const updated = [...services, newServ];
    setServices(updated);

    if (firebaseActive) {
      await setDoc(doc(db, "services", id), newServ);
    } else {
      localStorage.setItem("shan_services", JSON.stringify(updated));
    }
  };

  const editService = async (id, updatedServ) => {
    const updated = services.map(s => s.id === id ? { ...s, ...updatedServ } : s);
    setServices(updated);

    if (firebaseActive) {
      await setDoc(doc(db, "services", id), updated.find(s => s.id === id));
    } else {
      localStorage.setItem("shan_services", JSON.stringify(updated));
    }
  };

  const deleteService = async (id) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);

    if (firebaseActive) {
      await deleteDoc(doc(db, "services", id));
    } else {
      localStorage.setItem("shan_services", JSON.stringify(updated));
    }
  };

  const reorderServices = async (reorderedList) => {
    const normalized = reorderedList.map((s, idx) => ({ ...s, orderIndex: idx }));
    setServices(normalized);

    if (firebaseActive) {
      const batch = writeBatch(db);
      normalized.forEach(s => {
        batch.update(doc(db, "services", s.id), { orderIndex: s.orderIndex });
      });
      await batch.commit();
    } else {
      localStorage.setItem("shan_services", JSON.stringify(normalized));
    }
  };

  // Testimonials
  const addTestimonial = async (test) => {
    const id = "test_" + Date.now();
    const newTest = { id, ...test, orderIndex: testimonials.length };
    const updated = [...testimonials, newTest];
    setTestimonials(updated);

    if (firebaseActive) {
      await setDoc(doc(db, "testimonials", id), newTest);
    } else {
      localStorage.setItem("shan_testimonials", JSON.stringify(updated));
    }
  };

  const editTestimonial = async (id, updatedTest) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, ...updatedTest } : t);
    setTestimonials(updated);

    if (firebaseActive) {
      await setDoc(doc(db, "testimonials", id), updated.find(t => t.id === id));
    } else {
      localStorage.setItem("shan_testimonials", JSON.stringify(updated));
    }
  };

  const deleteTestimonial = async (id) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);

    if (firebaseActive) {
      await deleteDoc(doc(db, "testimonials", id));
    } else {
      localStorage.setItem("shan_testimonials", JSON.stringify(updated));
    }
  };

  const reorderTestimonials = async (reorderedList) => {
    const normalized = reorderedList.map((t, idx) => ({ ...t, orderIndex: idx }));
    setTestimonials(normalized);

    if (firebaseActive) {
      const batch = writeBatch(db);
      normalized.forEach(t => {
        batch.update(doc(db, "testimonials", t.id), { orderIndex: t.orderIndex });
      });
      await batch.commit();
    } else {
      localStorage.setItem("shan_testimonials", JSON.stringify(normalized));
    }
  };

  // Contact Info
  const saveContactInfo = async (newContact) => {
    setContactInfo(newContact);
    if (firebaseActive) {
      await setDoc(doc(db, "siteData", "contactInfo"), newContact);
    } else {
      localStorage.setItem("shan_contact", JSON.stringify(newContact));
    }
  };

  // Contact form inbox messages
  const addInboxMessage = async (msg) => {
    const id = "msg_" + Date.now();
    const newMsg = { id, date: new Date().toISOString(), status: "unread", ...msg };
    const updated = [newMsg, ...messages]; // Newest first in local state
    setMessages(updated);

    if (firebaseActive) {
      await setDoc(doc(db, "messages", id), newMsg);
    } else {
      localStorage.setItem("shan_messages", JSON.stringify(updated));
    }
  };

  const markMessageRead = async (id, isRead) => {
    const updated = messages.map(m => m.id === id ? { ...m, status: isRead ? "read" : "unread" } : m);
    setMessages(updated);

    if (firebaseActive) {
      await updateDoc(doc(db, "messages", id), { status: isRead ? "read" : "unread" });
    } else {
      localStorage.setItem("shan_messages", JSON.stringify(updated));
    }
  };

  const deleteMessage = async (id) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);

    if (firebaseActive) {
      await deleteDoc(doc(db, "messages", id));
    } else {
      localStorage.setItem("shan_messages", JSON.stringify(updated));
    }
  };

  // Global Site settings
  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    if (firebaseActive) {
      await setDoc(doc(db, "siteData", "settings"), newSettings);
    } else {
      localStorage.setItem("shan_settings", JSON.stringify(newSettings));
    }
  };

  // --- ADMIN AUTHENTICATION UTILITIES ---

  const login = async (username, password) => {
    if (firebaseActive) {
      // Firebase auth expects email. We will maps admin names to admin email.
      const email = username.includes("@") ? username : `${username}@portfolio.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      return userCredential.user;
    } else {
      // Local fallback mode authentication checks
      const localPassword = localStorage.getItem("shan_admin_password") || adminCredentials.defaultPassword;
      if (username === adminCredentials.username && password === localPassword) {
        const localUser = { email: "admin@portfolio.local", uid: "admin_local", isLocal: true };
        setCurrentUser(localUser);
        localStorage.setItem("shan_admin_session", "true");
        return localUser;
      } else {
        throw new Error("Invalid administrative credentials");
      }
    }
  };

  const loginWithGoogle = async () => {
    if (firebaseActive) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Verify email whitelist access against dynamic loaded settings
      const isAllowed = authorizedEmails.some(email => email.toLowerCase() === user.email.toLowerCase());

      if (!isAllowed) {
        await signOut(auth);
        throw new Error(`Access Denied: The Google account "${user.email}" is not whitelisted for admin credentials.`);
      }

      setCurrentUser(user);
      return user;
    } else {
      throw new Error("Google Sign-In is only active when your live Firebase Cloud configuration is connected.");
    }
  };

  // Add more dynamic authorized emails
  const addAdminEmail = async (email) => {
    if (!email || !email.includes("@")) throw new Error("Invalid email format");
    const cleanedEmail = email.toLowerCase().trim();
    if (authorizedEmails.some(e => e.toLowerCase() === cleanedEmail)) {
      throw new Error("This email is already whitelisted as an administrator.");
    }
    const newList = [...authorizedEmails, cleanedEmail];
    setAuthorizedEmails(newList);

    if (firebaseActive) {
      await setDoc(doc(db, "siteData", "admins"), { emails: newList });
    } else {
      localStorage.setItem("shan_authorized_emails", JSON.stringify(newList));
    }
  };

  // Delete dynamic authorized emails
  const deleteAdminEmail = async (email) => {
    const cleanedEmail = email.toLowerCase().trim();
    if (authorizedEmails.length <= 1) {
      throw new Error("Cannot delete the last remaining whitelisted administrator.");
    }
    const newList = authorizedEmails.filter(e => e.toLowerCase() !== cleanedEmail);
    setAuthorizedEmails(newList);

    if (firebaseActive) {
      await setDoc(doc(db, "siteData", "admins"), { emails: newList });
    } else {
      localStorage.setItem("shan_authorized_emails", JSON.stringify(newList));
    }
  };

  const logout = async () => {
    if (firebaseActive) {
      await signOut(auth);
      setCurrentUser(null);
    } else {
      setCurrentUser(null);
      localStorage.removeItem("shan_admin_session");
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (firebaseActive) {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
      } else {
        throw new Error("No active authenticated user");
      }
    } else {
      // Local mode password modification
      const localPassword = localStorage.getItem("shan_admin_password") || adminCredentials.defaultPassword;
      if (currentPassword === localPassword) {
        localStorage.setItem("shan_admin_password", newPassword);
      } else {
        throw new Error("Current password verification failed");
      }
    }
  };

  // --- DATA BACKUP PORTABILITY SERVICES ---

  const exportAllData = () => {
    const backup = {
      hero,
      about,
      portfolio,
      services,
      testimonials,
      contactInfo,
      settings
    };
    return JSON.stringify(backup, null, 2);
  };

  const importAllData = async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.hero) setHero(data.hero);
      if (data.about) setAbout(data.about);
      if (data.portfolio) setPortfolio(data.portfolio);
      if (data.services) setServices(data.services);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.contactInfo) setContactInfo(data.contactInfo);
      if (data.settings) setSettings(data.settings);

      // Write changes to persistence layer
      if (firebaseActive) {
        if (data.hero) await setDoc(doc(db, "siteData", "hero"), data.hero);
        if (data.about) await setDoc(doc(db, "siteData", "about"), data.about);
        if (data.contactInfo) await setDoc(doc(db, "siteData", "contactInfo"), data.contactInfo);
        if (data.settings) await setDoc(doc(db, "siteData", "settings"), data.settings);

        if (data.portfolio) {
          const batch = writeBatch(db);
          data.portfolio.forEach(p => {
            batch.set(doc(db, "portfolio", p.id), p);
          });
          await batch.commit();
        }
        if (data.services) {
          const batch = writeBatch(db);
          data.services.forEach(s => {
            batch.set(doc(db, "services", s.id), s);
          });
          await batch.commit();
        }
        if (data.testimonials) {
          const batch = writeBatch(db);
          data.testimonials.forEach(t => {
            batch.set(doc(db, "testimonials", t.id), t);
          });
          await batch.commit();
        }
      } else {
        if (data.hero) localStorage.setItem("shan_hero", JSON.stringify(data.hero));
        if (data.about) localStorage.setItem("shan_about", JSON.stringify(data.about));
        if (data.portfolio) localStorage.setItem("shan_portfolio", JSON.stringify(data.portfolio));
        if (data.services) localStorage.setItem("shan_services", JSON.stringify(data.services));
        if (data.testimonials) localStorage.setItem("shan_testimonials", JSON.stringify(data.testimonials));
        if (data.contactInfo) localStorage.setItem("shan_contact", JSON.stringify(data.contactInfo));
        if (data.settings) localStorage.setItem("shan_settings", JSON.stringify(data.settings));
      }
      return true;
    } catch (e) {
      console.error("Backup file import failed:", e);
      throw new Error("Invalid backup JSON syntax structure");
    }
  };

  return (
    <SiteDataContext.Provider value={{
      hero,
      about,
      portfolio,
      services,
      testimonials,
      contactInfo,
      messages,
      settings,
      currentUser,
      loading,
      firebaseActive,
      saveHeroData,
      saveAboutData,
      addProject,
      editProject,
      deleteProject,
      reorderProjects,
      addService,
      editService,
      deleteService,
      reorderServices,
      addTestimonial,
      editTestimonial,
      deleteTestimonial,
      reorderTestimonials,
      saveContactInfo,
      addInboxMessage,
      markMessageRead,
      deleteMessage,
      saveSettings,
      login,
      loginWithGoogle,
      logout,
      changePassword,
      exportAllData,
      importAllData,
      authorizedEmails,
      addAdminEmail,
      deleteAdminEmail
    }}>
      {children}
    </SiteDataContext.Provider>
  );
};
