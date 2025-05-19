
  let read_file filename =
    let ic = open_in filename in
    let rec read_lines acc =
      try
        let line = input_line ic in
        read_lines (line :: acc)
      with End_of_file ->
        close_in ic;
        List.rev acc
    in
    read_lines []



(* ------------------------ *)

let match_sum lst offset =
    let len = List.length lst in
    let arr = Array.of_list lst in
    let indices = List.init len (fun i -> i) in
    List.fold_left (fun acc i ->
      let j = (i + offset) mod len in
      if arr.(i) = arr.(j) then acc + arr.(i) else acc
    ) 0 indices

let string_to_digits s =
    s
    |> String.to_seq
    |> Seq.map (String.make 1)
    |> Seq.map int_of_string
    |> List.of_seq


(* Main  *)
let () = 
  let lines = read_file "input.txt" in
  match lines with 
  | [line] ->
    let digits = string_to_digits line in 
    let result1 = match_sum digits 1 in 
    let pt_2_offset = ( List.length digits ) / 2 in
    let result2 = match_sum digits pt_2_offset in 
    Printf.printf "Pt 1: %d\n" result1;
    Printf.printf "Pt 2: %d\n" result2
  | _ -> 
    Printf.printf "Expected a single-line input file.\n"