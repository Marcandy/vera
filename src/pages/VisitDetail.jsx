import { useParams } from 'react-router'

const VisitDetail = () => {
    const { visitId }  =  useParams()
    return (
        <div>
            { `VisitDetail` }
            {visitId}
        </div>
    )
}

export default VisitDetail;

/*
    Onclick on VisitCard I need to go to visitDetail
    do it with Link and react router + plus id of that vist
    --- or is it just a state change

    I need to show more detail like caregiver assessment /note, list of prescriptions
    and what the current status need
*/ 
