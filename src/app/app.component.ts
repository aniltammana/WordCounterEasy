import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ElementRef,
} from "@angular/core";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { UserInput } from "./Models/WordCounter";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "WordCounterEasy";
  htmlContent = "";
  userInput: UserInput;
  recognition: any;
  @Input()
  content: string;
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();

  constructor(private el: ElementRef) {
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onresult = (event) => {
      this.el.nativeElement.querySelector(".content").value +=
        event.results[0][0].transcript;
      this.htmlContent += event.results[0][0].transcript;
      this.onChange(this.htmlContent, true);
      //console.log("in rsult ", event.results[0][0].transcript);
      document.getElementById("toolbar").focus();
      this.showHide("add");
    };

    this.recognition.onnomatch = () => {
      this.showHide("add");
    };

    this.userInput = new UserInput();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.hideUnUsedFunctions();
  }
  hideUnUsedFunctions() {
    document.getElementById("insertImage-editor2").style.display = "none";
    document.getElementById("insertVideo-editor2").style.display = "none";
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["bold"]],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };

  onChange(event: any, isTranscript: boolean = false) {
    // this.hideUnUsedFunctions();
    // let parsedHtml = new DOMParser().parseFromString(htmlContent, "text/html");
    // if (parsedHtml && event && event != "") {
    //   let elements = parsedHtml.getElementsByTagName("font");
    //   console.log(elements);
    //   for (let index = 0; index < elements.length; index++) {
    //     const element = elements[index];
    //     this.userInput.inputText = element.innerText;
    //   }

    if (isTranscript) {
      this.userInput.inputText = event;
    } else {
      this.userInput.inputText = document.getElementById(
        "divUserInput"
      ).innerText;
    }
    this.updateWordCount();
    this.updateCharacterCount();
    //}
  }

  updateWordCount(): void {
    this.userInput.wordCount = (
      this.userInput.inputText.match(/\S+/g) || ""
    ).length;
  }

  updateCharacterCount(): void {
    this.userInput.characterCount = (this.userInput.inputText || "").length;
  }
  showHide(action) {
    if (action === "add") {
      document.getElementsByClassName("voice")[0].classList.add("show");
    } else {
      document.getElementsByClassName("voice")[0].classList.remove("show");
    }
  }
  onDismiss(event) {
    this.dismiss.emit(event);
  }

  onFocusOut(event) {
    this.focusout.emit(event);
  }

  record(event) {
    this.showHide("remove");
    this.recognition.start();
  }

  hideImage() {
    document.getElementsByClassName("voice")[0].classList.add("show");
  }
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
