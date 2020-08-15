import React, {Component} from 'react'
import classes from './quizCreator.module.css'
import Button from '../../components/UI/button/button'
import {creatControl, validate, validateForm} from '../../form/formFramework'
import Input from '../../components/UI/input/input'
import Auxiliary from '../../hoc/auxiliary/auxiliary'
import Select from '../../components/UI/select/select'
import {connect} from 'react-redux'
import {finishCreateQuiz, createQuizQuestion} from '../../store/actions/create'

function creatOptionControl(number) {
    return creatControl({
        label: 'Вариант ' + number,
        errorMessage: 'Значение не может быть пустым',
        id: number
    }, {
        required: true
    })
}

function createFormControls() {
    return {
        quistion: creatControl({
            label: 'Введите вопрос',
            errorMessage: 'Вопрос не может быть пустым'
        },
        {
            required: true
        }),
        option1: creatOptionControl(1),
        option2: creatOptionControl(2),
        option3: creatOptionControl(3),
        option4: creatOptionControl(4),
    }
}

class QuizCreator extends Component {

    state= {
        isFormValid: false,
        rightAnswerId: 1,
        formControls: createFormControls(),
    }

    submitHandler = event => {
        event.preventDefault()
    }

    addQuestionHandler = (event) => {
        event.preventDefault()

        const questionItem = {
            question: this.state.formControls.quistion.value,
            id: this.props.quiz.length + 1,
            rightAnswerId: this.state.rightAnswerId,
            answers: [
                {text: this.state.formControls.option1.value, id: this.state.formControls.option1.id},
                {text: this.state.formControls.option2.value, id: this.state.formControls.option2.id},
                {text: this.state.formControls.option3.value, id: this.state.formControls.option3.id},
                {text: this.state.formControls.option4.value, id: this.state.formControls.option4.id}
            ]
        }

        this.props.createQuizQuestion(questionItem)

        this.setState({
            isFormValid: false,
            rightAnswerId: 1,
            formControls: createFormControls(),
        })
    }

    creatrQuizHandler =  (event) => {
        event.preventDefault()

        this.setState({
            isFormValid: false,
            rightAnswerId: 1,
            formControls: createFormControls(),
        })

        this.props.finishCreateQuiz()
    }

    changeHandler = (value, controlName) => {
        const formControls = {  ...this.state.formControls }
        const control = { ...formControls[controlName] }

        control.touched = true
        control.value = value
        control.valid = validate(control.value, control.validation)

        formControls[controlName] = control

        this.setState({
            formControls,
            isFormValid: validateForm(formControls)
        })
    }

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]

            return(
                <Auxiliary key={controlName + index}>
                    <Input
                        label={control.label}
                        value={control.value}
                        valid={control.valid}
                        shouldValidate={!!control.validation}
                        touched={control.touched}
                        errorMessage={control.errorMessage}
                        onChange={event => this.changeHandler(event.target.value, controlName)}
                        key={index}
                    />
                    { index === 0 ? <hr/> : null }
                </Auxiliary>
            )
        })
    }

    selectChangeHandler = event => {
        this.setState({
            rightAnswerId: +event.target.value
        })
    }

    render () {
        const select = <Select
            label='ВЫберите правильный ответ'
            value={this.state.rightAnswerId}
            onChange={this.selectChangeHandler}
            options={[
                {text: 1, value: 1},
                {text: 2, value: 2},
                {text: 3, value: 3},
                {text: 4, value: 4}
            ]}
        />

        return (
            <div className={classes.QuizCreator}>
                <div>
                    <h1>Создание теста</h1>

                    <form onSubmit={this.submitHandler}>
                        
                        { this.renderInputs() }
                        
                        {select}

                        <hr/>

                        <Button type='primary' onClick={this.addQuestionHandler} disabled={!this.state.isFormValid}>
                            Добавить вопрос
                        </Button>
                        <Button type='success' onClick={this.creatrQuizHandler} disabled={this.props.quiz.length === 0}>
                            Создать тест
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        quiz: state.create.quiz
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createQuizQuestion: item => dispatch(createQuizQuestion(item)),
        finishCreateQuiz: () => dispatch(finishCreateQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator)