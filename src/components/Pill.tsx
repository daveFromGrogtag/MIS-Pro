const Pill = ({keyName, valueName}) => {
    return (<span style={{"fontSize": ".85rem", "border": "solid lightgrey 1px", "borderRadius": "5px", "marginRight": ".5rem", "marginBottom": ".25rem", "display": "inline-block"}}>
        <span style={{"backgroundColor": "lightblue", "fontWeight": "600", "padding": "0 .5rem"}}>{keyName}</span><span style={{"padding": "0 .5rem"}}>{valueName}</span>
    </span>)
}

export default Pill