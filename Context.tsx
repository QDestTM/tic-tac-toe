import { createContext, Context } from "react";
import { MatchState } from "./models/TurnTypes";


export const MatchContext: Context<MatchState> = createContext(null)