import { useEffect, useState } from "react";

interface IOptions {
    setOnCall?: boolean
}
export default function useLocalStorage<T>(key: string, initialValue: T | (() => T), options?:IOptions) {
 const [value, setValue] = useState<T>(() => {
    const JSONvalue = localStorage.getItem(key)
    if(JSONvalue == null) {
        if(typeof initialValue === "function") {
            //@ts-ignore
           return initialValue() 
        } else {
            return initialValue
        }
    } else {
        return JSON.parse(JSONvalue)
    }
 })
 const [setOnCall, setSetOnCall] = useState(options?.setOnCall != undefined ? options?.setOnCall : true) 

 useEffect(() => {
    if(setOnCall) {
        localStorage.setItem(key, JSON.stringify(value))
    }
    setSetOnCall(true)
 }, [value])

 return [value, setValue] as [T, typeof setValue]
}