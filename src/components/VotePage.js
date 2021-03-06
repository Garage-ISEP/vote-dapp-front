import React from "react";
import VoteTitle from "./VoteTitle";
import Question from "./Question";
import CandidatesGrid from "./CandidatesGrid";
import SubmitVote from "./SubmitVote";
import {useDispatch, useSelector} from "react-redux";
import {handleError} from "../utils/utils";
import {setVoteElem} from "../redux/actions";
import {fetchAddrAndSetContract, fetchContractData, fetchScores}
    from "../redux/asyncActions";
import {VOTE_STATUS} from "../redux/constants";

/**
 * @return {null}
 */
function VotePage() {
    // hooks cannot be called conditionally (funcs "use<something>")
    const dispatch = useDispatch();
    const contract = useSelector(state => state.ethereum.contract);
    const error = useSelector(state => state.vote.error);
    const code = useSelector(state => state.vote.code);
    const ballotName = useSelector(state => state.vote.ballotName);
    const candidateNames = useSelector(state => state.vote.candidateNames);
    const title = useSelector(state => state.vote.title);
    const endTime = useSelector(state => state.vote.endTime);
    const question = useSelector(state => state.vote.question);
    const voteStatus = useSelector(state => state.vote.voteStatus);
    const scores = useSelector(state => state.vote.scores);
    const classname  = "vote-page";
    const urlParams = new URLSearchParams(window.location.search);

    if (error)
        return handleError(error); // stops the script here
    if (voteStatus === VOTE_STATUS.WAITING_SIGNATURE)
        return (
            <div className={classname}>
                <Question text={"Veuillez confirmer votre vote avec votre " +
                "wallet"}/>
            </div>
        );
    if (voteStatus === VOTE_STATUS.SUCCESS)
        return (
            <div className={classname}>
                <Question text={"Votre vote est enregistré !"} mode={"cool"}/>
            </div>
        );
    if (!ballotName) {
        if (urlParams.get("name"))
            dispatch(setVoteElem("ballotName",urlParams.get("name")));
        else
            dispatch(setVoteElem("error",
                "erreur: le nom du scrutin n'est pas dans l'url"));
        return null;
    }
    if (!contract) {
        dispatch(fetchAddrAndSetContract(ballotName));
        return null;
    }
    if (!endTime || !title || !question || !candidateNames){
        dispatch(fetchContractData());
        return null;
    }
    if (endTime.getTime() < Date.now()){ // ballot is closed, show results
        if (!scores){
            dispatch(fetchScores());
            return null;
        }
        return (
            <div className={classname}>
                <VoteTitle text={title}/>
                <Question text={question}/>
                <br/>
                <Question text={"resultats"}/>
                <br/>
                {scores}
            </div>
        );
    }
    if (!code) {
        if (urlParams.get("code"))
            dispatch(setVoteElem("code",urlParams.get("code")));
        else
            dispatch(setVoteElem("error",
                "erreur: le code du votant n'est pas dans l'url"));
        return null;
    }

    return (
        <div className={classname}>
            <VoteTitle text={title}/>
            <Question text={question}/>
            <CandidatesGrid candidates={candidateNames}/>
            <SubmitVote/>
        </div>
    );
}

export default VotePage;