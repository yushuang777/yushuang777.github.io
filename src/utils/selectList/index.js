import React, { Component } from 'react';
import './index.css';

class Dropdown extends Component {
    state = {
        selectedOption: '',
        isOpen: false,
    };

    handleToggleDropdown = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    };

    handleSelectOption = (option) => {
        const selectedOption = option.rank?option:option.value;
        this.props.changeCompany(selectedOption);
        this.setState({
            selectedOption: option,
            isOpen: false,
        });
    };

    render() {
        const { options, defaultCompany } = this.props;
        const { selectedOption, isOpen } = this.state;
        return (
            <div className={`select-wrapper ${isOpen ? 'open' : ''}`}>
                <div className="selected-option" onClick={this.handleToggleDropdown}>
                    {selectedOption ? selectedOption.label : defaultCompany}
                </div>
                <ul className={`options ${isOpen ? 'open' : ''}`}>
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={`option ${selectedOption === option.value ? 'selected' : ''}`}
                            onClick={() => this.handleSelectOption(option)}
                            value={option.value}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Dropdown;
