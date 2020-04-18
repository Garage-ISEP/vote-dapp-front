import React, {useState} from "react";
import VoteTitle from "./VoteTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CandidateInputList from "./CandidateInputList";
import bytesInfo from "../utils/utils";
import addrs from "email-addresses";

function BallotCreatePage() {
    let classname = "ballot-create-page";
    const [name, setName] = useState("");
    const [question, setQuestion] = useState("");
    const [endDate, setEndDate] = useState(new Date());
    const [mails, setMails] = useState("");
    const [extEnabled, setExtEnabled] = useState(false);

    let nameId = "name";
    let questionId = "question";
    let mailsId = "mails";
    let extEnabledId = "extEnab";

    return(
        <div className={classname}>
            <VoteTitle text={"Créez un nouveau vote"}/>
            <br/>

            <label htmlFor={nameId}>Nom du vote</label>
            <input id={nameId}
                   type={"text"}
                   value={name}
                   onChange={e => setName(e.target.value)}/>
            {bytesInfo(name)}
            <br/>

            <label htmlFor={questionId}>Question aux votants</label>
            <input id={questionId}
                   type={"text"}
                   value={question}
                   onChange={e => setQuestion(e.target.value)}/>
            {bytesInfo(question)}
            <br/>

            <div>Date et heure de fin du vote</div>
            <DatePicker selected={endDate}
                        onChange={date => setEndDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"/>
            <div className={"incorrect-data"}>
                {Date.now() < endDate ?
                "" :
                "la date doit être dans le futur"}
            </div>
            <br/>

            <label htmlFor={mailsId}>
                Adresses e-mail des votants ATTENTION :
                n'entrez qu'une adresse par votant
            </label>
            <input id={mailsId}
                   type={"textarea"}
                   value={mails}
                   placeholder={"copiez-collez ici"}
                   onChange={e => setMails(e.target.value)}/>
            {"nombre d'adresses détéctées : "
            + (addrs.parseAddressList(mails) ?
                addrs.parseAddressList(mails).length :
                "0")}
            <br/>
            <br/>

            <label htmlFor={extEnabledId}>Activer les pénalités/bonus</label>
            <input type={"checkbox"} id={extEnabledId}
                   checked={extEnabled}
                   onChange={() => setExtEnabled(!extEnabled)}/>
            <br/>

            <CandidateInputList/>
            <br/>

            <button>Publier !</button>
        </div>
    );
}

export default BallotCreatePage;