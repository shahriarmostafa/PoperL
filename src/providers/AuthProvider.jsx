import { createContext } from "react";




const AuthContext = createContext(null);
export default function AuthProvider(){

    const simpleinfo = {
        name: 'Karim',
        age: 22
    }

    return (
        <AuthContext.Provider value={simpleinfo}>

        </AuthContext.Provider>
    );
}