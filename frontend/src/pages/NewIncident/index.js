import React, { useState } from "react";

import { Link, useHistory } from "react-router-dom";

import "./style.css";
import { FiArrowLeft } from "react-icons/fi";
import logoImg from "../../assets/logo.svg";
import api from "../../services/api";

export default function NewIncident() {
  const ongId = localStorage.getItem("ongId");

  const history = useHistory();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");

  async function handleNewIncindent(e) {
    e.preventDefault();

    const data = {
      title,
      desc,
      value
    };
    try {
      api.post("incidents", data, {
        headers: {
          authorization: ongId
        }
      });

      history.push("/profile");
    } catch {}
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />

          <h1>Cadastrar novo caso</h1>
          <p>
            Descreva o texto detalhadamente para encontar um herói para resolver
            isso.
          </p>
          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar para home
          </Link>
        </section>

        <form onSubmit={handleNewIncindent}>
          <input
            placeholder="Titulo do caso"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          ></textarea>
          <input
            placeholder="Valor em reais"
            value={value}
            onChange={e => setValue(e.target.value)}
          />

          <button className="button" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
