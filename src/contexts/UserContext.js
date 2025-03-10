import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    console.log("User session:", session.user); // Log the user session

                    const { data, error } = await supabase
                        .from("users")
                        .select("role")
                        .eq("uid", session.user.id)
                        .single();

                    console.log("Supabase query result:", data); // Log the query result
                    console.log("Supabase query error:", error); // Log the query error

                    if (error) {
                        console.error("Error fetching user role:", error);
                    } else {
                        setRole(data?.role || null);
                    }
                    console.log("Current role state:", data?.role || null)
                } else {
                    setUser(null);
                    setRole(null);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, role }}>
            {children}
        </UserContext.Provider>
    );
};