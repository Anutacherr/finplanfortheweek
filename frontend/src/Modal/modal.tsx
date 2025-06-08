import React, {useState} from "react";
import "./modal.scss";

class Modal extends React.Component<{ active: any, setActive: any, children: any }> {
    render() {
        let {active, setActive, children} = this.props;
        return (
            <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
                <div className={active ? "modal__content active" : "modal__content"}
                     onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Modal;