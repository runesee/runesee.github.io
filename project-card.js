export class ProjectCard extends HTMLElement {
  connectedCallback() {
    const wrapperId = this.getAttribute("wrapperId") || "npcaiWrapper";
    const title = this.getAttribute("title") || "";
    const description = this.getAttribute("description") || "";
    const image = this.getAttribute("image") || "";
    const icon = this.getAttribute("icon") || "";
    const url = this.getAttribute("url") || "";
    const left = this.getAttribute("left") || "";

    this.innerHTML = `
      <a class="projectLinkWrapper" href="${url}">
        <div id="${wrapperId}" class="projectElement ${
      left === "true" ? "blockViewLeft" : "blockViewCenter"
    } boxShadow hidden">
            <img alt="Thumbnail image of project" src="${image}" />
          <div class="description">
            <div class="projectHeaderContainer">
              <h3>${title}</h3>
              <img
                src="${icon}"
                class="skillIcons"
              />
            </div>
            <p>
              ${description}
            </p>
          </div>
        </div>
      </a>
    `;
  }
}
customElements.define("project-card", ProjectCard);
